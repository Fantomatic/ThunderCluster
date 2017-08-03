FROM sogeti/base_container:1.0
MAINTAINER G.CUPILLARD (Sogeti France)

COPY idbWriteScript/writeToInfluxdb.py /root/venv/

WORKDIR /root/venv
ENTRYPOINT /root/venv/bin/python writeToInfluxdb.py&

EXPOSE 6500



