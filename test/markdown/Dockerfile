FROM python:3

COPY requirements.txt /tmp/

RUN pip install -r /tmp/requirements.txt

ADD markdown_test.py /

ENV DEFUND12_EMAIL_DIR /email_markdown_files/us

CMD [ "python", "./markdown_test.py" ]
