terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

# 1. Create isolated network with unique name
resource "docker_network" "tf_net" {
  name = "tf-network-${substr(sha256(timestamp()), 0, 8)}" # Correct syntax
  lifecycle {
    ignore_changes = [name] # Keep name after creation
  }
}

# 2. Frontend - Using existing image
resource "docker_container" "frontend" {
  name  = "tf-frontend"
  image = "devops-project-frontend:latest"
  
  ports {
    internal = 3000
    external = 3000
  }

  networks_advanced {
    name = docker_network.tf_net.name
  }
}

# 3. Backend - Using existing image
resource "docker_container" "backend" {
  name  = "tf-backend"
  image = "devops-project-backend:latest"

  ports {
    internal = 5000
    external = 5000
  }

  networks_advanced {
    name = docker_network.tf_net.name
  }
}