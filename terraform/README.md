# Initial hand operations
## 1. Service account for Terraform
1. Create a service account for Terraform.
2. Download service account key file as JSON (named `service_account_key.json`) of the service account.
3. Put it to `<repo root>/terraform/`.


## 2. GCS to store terraform state
Create a bucket in GCS for storing terraform state. See `main.tf`.


## 3. Enable Cloud Resource Manager API
Need to enable Cloud Resource Manager API to allow terraform to operate.

```
# Do after you activate the GCP project with gcloud command.

$ gcloud services enable cloudresourcemanager.googleapis.com
```


## 4. Cloud Source Repository
Create and connect this repository in Cloud Source Repository.  
ref. https://cloud.google.com/source-repositories/docs/quickstart


## 5. Create a firebase docker image
Need to create a docker image including firebase command for deploy on CloudBuild.

```
# Do after you activate the GCP project with gcloud command.

$ cd <repo root>/terraform/scripts/
$ ./firebase-image.sh
```


## 6. Firebase project
Create a Firebase project associating with the GCP project. The project is named same name of the GCP project due to make project id common.  
https://console.firebase.google.com/
