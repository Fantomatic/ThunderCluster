FROM sogeti/base_container:1.0
MAINTAINER G.CUPILLARD (Sogeti France)

COPY idbWriteScript/writeToInfluxdb.py /root/venv/
RUN /root/venv/bin/python writeToInfluxdb.py

WORKDIR /root/
