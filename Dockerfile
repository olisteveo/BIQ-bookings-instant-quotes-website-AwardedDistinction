FROM ewc2020/web:php-5.6-apache-latest

# Set some image labels
LABEL evilwizardcreations.image.authors="evil.wizard95@googlemail.com" \
    evilwizardcreations.image.php.version="5.6"

COPY ./app /var/www/public_html
