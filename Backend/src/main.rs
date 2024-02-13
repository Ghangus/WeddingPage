use actix_cors::Cors;
use actix_web::{get, http::header, web, App, HttpResponse, HttpServer, Responder};
use rand::Rng;
use std::fs;

async fn get_random_file() -> impl Responder {
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
        }
    }

    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..file_names.len());
    println!("Random file = {}", file_names[random_index].to_string());
    HttpResponse::Ok().body(file_names[random_index].to_string())
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
        // Add other services or configurations as needed
    })
    .bind("localhost:8080")?
    .run()
    .await
}
