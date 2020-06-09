FROM python:3

COPY requirements.txt /tmp/

RUN pip install -r /tmp/requirements.txt

ADD markdown_test.py /

CMD [ "python", "./markdown_test.py" ]
