use actix_cors::Cors;
use actix_files::NamedFile;
use actix_web::http::header::ContentDisposition;
use actix_web::{http::header, web, App, Error, HttpRequest, HttpResponse, HttpServer, Responder};
use rand::Rng;
use std::fs;

fn filelist() -> Vec<String> {
    let path = "/home/pi/Nextcloud/Photos/WeddingImages";
    let files = fs::read_dir(path).unwrap();

    let mut file_names = Vec::new();
    println!("Path = {}", path);
    for file in files {
        if let Ok(file) = file {
            if let Some(file_name) = file.file_name().to_str() {
                if file_name.to_lowercase().ends_with(".jpeg") {
                    file_names.push(file_name.to_string());
                }
            }
        } else {
            println!("Error reading file");
        }
    }
    file_names
}

fn random_file() -> String {
    let file_names = filelist();
    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..file_names.len());
    file_names[random_index].to_string()
}

async fn get_random_file() -> impl Responder {
    let file = random_file();
    println!("Random file = {}", file);
    HttpResponse::Ok().body(file)
}

async fn get_all_files() -> impl Responder {
    let file_names = filelist();
    HttpResponse::Ok().body(file_names.join("\n"))
}

async fn download_file() -> Result<NamedFile, Error> {
    // Specify the path to the file you want to serve
    let file = NamedFile::open(random_file())?;

    // Optionally, set content disposition (e.g., attachment; filename="filename.ext")
    // This prompts the browser to download the file instead of trying to open it.
    let cd = ContentDisposition {
        disposition: actix_web::http::header::DispositionType::Attachment,
        parameters: vec![actix_web::http::header::DispositionParam::Filename(
            "filename.ext".to_string(), // Update this filename
        )],
    };

    Ok(file.set_content_disposition(cd))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000") // Allow specific origin
            .allowed_methods(vec!["GET", "POST"]) // Specify allowed methods
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(web::resource("/get_random_file").to(get_random_file))
            .service(web::resource("/get_all_files").to(get_all_files))
            .service(web::resource("/get_file").to(download_file))
        // Add other services or configurations as needed
    })
    .bind("localhost:8080")?
    .run()
    .await
}
