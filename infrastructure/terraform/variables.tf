variable "region" {
  type        = string
  description = "AWS region to deploy to"
}

variable "ami_id" {
  type        = string
  description = "AMI ID for EC2"
}

variable "riot_api_key" {
  type        = string
  description = "Riot API key for the app"
  sensitive   = true
}
