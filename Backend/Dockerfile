 # Pull base image.
FROM java:8

add ./target/gs-accessing-mongodb-data-rest-0.1.0.jar .

EXPOSE 80

cmd java -jar gs-accessing-mongodb-data-rest-0.1.0.jar

# Define commonly used JAVA_HOME variable
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle
