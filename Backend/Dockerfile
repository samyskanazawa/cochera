FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD target/gs-accessing-mongodb-data-rest-0.1.0.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java","-jar","/app.jar"]
