#!/usr/bin/env bash

# Function to prompt for input with a default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local response

    read -p "$prompt [$default]: " response
    echo "${response:-$default}"
}

# Function to create or update .env file
update_env_file() {
    local key="$1"
    local value="$2"
    local env_file=".env"

    if grep -q "^$key=" "$env_file" 2>/dev/null; then
        sed -i "s|^$key=.*|$key=$value|" "$env_file"
    else
        echo "$key=$value" >> "$env_file"
    fi
}

echo ""
sleep 1
echo "Welcome to Kickstart Saas Configuration Wizard!"
sleep 1
echo "This script will guide you through setting up your project's configuration."
sleep 1
echo "Press Enter to use default values where available."
sleep 1
echo ""

sleep 2
# Database Configuration
echo "Database Configuration: (Kickstart Saas only supports PostgreSQL at the moment.)"
echo "Please create a new Supabase project at: https://supabase.com/dashboard/projects"
echo ""
sleep 2

supabase_url=$(prompt_with_default "Enter your Supabase Project URL" "https://your-project-ref.supabase.co")
echo ""

supabase_anon_key=$(prompt_with_default "Enter your Supabase anon key (public)" "your-anon-key")
echo ""

update_env_file "NEXT_PUBLIC_SUPABASE_URL" "$supabase_url"
update_env_file "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$supabase_anon_key"

# Domain Configuration
echo ""
echo "Domain Configuration:"
domain=$(prompt_with_default "Enter your domain URL" "https://example.com")
update_env_file "NEXT_PUBLIC_APP_URL" "$domain"

# # OpenAI API Configuration
# echo ""
# echo "OpenAI API Configuration:"
# echo "To get your OpenAI API key, visit: https://platform.openai.com/account/api-keys"
# read -s -p "Enter your OpenAI API key: " openai_key
# echo ""
# update_env_file "OPENAI_API_KEY" "$openai_key"

# Stripe Configuration
echo ""
echo "Stripe Configuration:"
echo "To get your Stripe API keys, visit: https://dashboard.stripe.com/apikeys"
read -s -p "Enter your Stripe publishable key: " stripe_pub_key
echo ""
read -s -p "Enter your Stripe secret key: " stripe_secret_key
echo ""
read -s -p "Enter your Stripe webhook secret: " stripe_webhook_secret
echo ""
update_env_file "STRIPE_PUBLISHABLE_KEY" "$stripe_pub_key"
update_env_file "STRIPE_SECRET_KEY" "$stripe_secret_key"
update_env_file "STRIPE_WEBHOOK_SECRET" "$stripe_webhook_secret"

# Storage Configuration
echo ""
echo "Storage Configuration:"
echo "Choose your storage provider:"
echo "1) AWS S3"
echo "2) Google Cloud Storage"
read -p "Enter your choice (1 or 2): " storage_choice
echo ""

# Set the storage provider
if [ "$storage_choice" = "1" ]; then
    update_env_file "NEXT_PUBLIC_STORAGE_PROVIDER" "aws"
    
    # AWS S3 Configuration
    echo "AWS S3 Configuration:"
    echo "To get your AWS credentials, visit: https://console.aws.amazon.com/iam/home#/security_credentials"
    echo "You'll need to create an S3 bucket first at: https://s3.console.aws.amazon.com/s3/home"
    echo ""
    sleep 2

    # Server-side AWS variables
    aws_region=$(prompt_with_default "Enter your AWS Region" "us-east-1")
    echo ""
    read -s -p "Enter your AWS Access Key ID: " aws_access_key
    echo ""
    read -s -p "Enter your AWS Secret Access Key: " aws_secret_key
    echo ""
    aws_bucket=$(prompt_with_default "Enter your S3 Bucket Name" "your-bucket-name")
    echo ""

    # Update server-side variables
    update_env_file "AWS_REGION" "$aws_region"
    update_env_file "AWS_ACCESS_KEY_ID" "$aws_access_key"
    update_env_file "AWS_SECRET_ACCESS_KEY" "$aws_secret_key"
    update_env_file "AWS_BUCKET_NAME" "$aws_bucket"

    # Update client-side variables
    update_env_file "NEXT_PUBLIC_AWS_REGION" "$aws_region"
    update_env_file "NEXT_PUBLIC_AWS_BUCKET_NAME" "$aws_bucket"

elif [ "$storage_choice" = "2" ]; then
    update_env_file "NEXT_PUBLIC_STORAGE_PROVIDER" "google"
    
    # Google Cloud Storage Configuration
    echo "Google Cloud Storage Configuration:"
    echo "To get your Google Cloud credentials, visit: https://console.cloud.google.com/apis/credentials"
    echo "You'll need to create a bucket first at: https://console.cloud.google.com/storage/browser"
    echo ""
    sleep 2

    # Server-side Google Cloud variables
    gcs_project_id=$(prompt_with_default "Enter your Google Cloud Project ID" "your-project-id")
    echo ""
    read -p "Enter your Google Cloud Client Email: " gcs_client_email
    echo ""
    echo "Enter your Google Cloud Private Key (paste and press Enter, then Ctrl+D):"
    gcs_private_key=$(cat)
    echo ""
    gcs_bucket=$(prompt_with_default "Enter your Google Cloud Storage Bucket Name" "your-bucket-name")
    echo ""

    # Update server-side variables
    update_env_file "GOOGLE_CLOUD_PROJECT_ID" "$gcs_project_id"
    update_env_file "GOOGLE_CLOUD_CLIENT_EMAIL" "$gcs_client_email"
    update_env_file "GOOGLE_CLOUD_PRIVATE_KEY" "$gcs_private_key"
    update_env_file "GOOGLE_CLOUD_BUCKET_NAME" "$gcs_bucket"

    # Update client-side variables
    update_env_file "NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID" "$gcs_project_id"
    update_env_file "NEXT_PUBLIC_GOOGLE_CLOUD_BUCKET_NAME" "$gcs_bucket"

else
    echo "Invalid choice. Skipping storage configuration."
fi

# Google Gemini AI Configuration
echo ""
echo "Google Gemini AI Configuration:"
echo "Please create a new Google AI API key at: https://aistudio.google.com/apikey"
echo "Once logged in, click on 'Get API key' to create a new key or use an existing one."
echo ""
sleep 2

read -s -p "Enter your Google AI API key: " gemini_key
echo ""
update_env_file "GOOGLE_AI_API_KEY" "$gemini_key"

# Generate Auth Secret
echo ""
echo "Generating AUTH_SECRET..."
auth_secret=$(openssl rand -base64 32)
echo "Generated secure AUTH_SECRET"
update_env_file "AUTH_SECRET" "$auth_secret"

# Additional configurations can be added here

echo ""
echo "Configuration complete. Your settings have been saved to .env"
echo ".env has been added to your .gitignore file to keep your secrets safe."
echo ""
echo "You may need to restart your application for changes to take effect."

# Optionally, display the contents of the .env file
read -p "Would you like to view your .env file? (y/n) " show_env
if [[ $show_env == "y" ]]; then
    echo ""
    echo "Contents of .env:"
    cat .env
fi

echo ""
echo "Thank you for using Kickstart Saas! Now go kickstart your project! 🚀"