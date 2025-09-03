start:
	ng serve --ssl true \
	         --ssl-cert ./certs/localhost.gratistoria.com.pem \
	         --ssl-key ./certs/localhost.gratistoria.com-key.pem \
	         --host localhost.gratistoria.com \
	         --port 4200
