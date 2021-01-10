#!/bin/bash

set -o pipefail
set -e
set -x

for X in $(seq 5)
do
  PROJECT_ID=$(restish local_sms createnewproject_project_post --name testproject-$X -o json | jq -r .body.id)
  for A in $(seq 13)
  do
          ARTICLE_ID=$(restish local_sms createnewarticle_project__project_id__article_post $PROJECT_ID --name testarticle-$A -o json | jq -r .body.id)
    for B in $(seq 12)
    do
      restish local_sms addelement_project__project_id__article__article_id__element_post $PROJECT_ID $ARTICLE_ID name: name-$A-$B, value: hummel-$A-$B
    done
  done
done
