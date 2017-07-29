FROM centos:7
MAINTAINER G.Cupillard (Sogeti France)

RUN yum update -y
RUN yum install -y epel-release
RUN yum install -y nodejs httpd
RUN  npm install -g bower
COPY ihm /var/www/ihm/
COPY API /root/API/

WORKDIR /var/www/ihm/
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN bower install

WORKDIR /root/API/
RUN npm install 

EXPOSE 3000
CMD ["node", "/root/API/server.js"]
