FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD target/gs-accessing-mongodb-data-rest-0.1.0.jar app.jar
RUN sh -c 'touch /app.jar'
COPY Base64.cer $JAVA_HOME/jre/lib/security
RUN \
    cd $JAVA_HOME/jre/lib/security \
    && keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias STKDC -file Base64.cer
ENTRYPOINT ["java","-jar","/app.jar"]
