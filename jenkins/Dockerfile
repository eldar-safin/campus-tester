FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl sudo \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl --fail --silent --show-error --location \
        https://download.docker.com/linux/debian/gpg \
        --output /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc \
    && . /etc/os-release \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian ${VERSION_CODENAME} stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install --yes --no-install-recommends docker-ce-cli docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

COPY --chmod=0755 docker-wrapper.sh /usr/local/bin/docker
COPY --chmod=0440 jenkins-docker.sudoers /etc/sudoers.d/jenkins-docker

RUN visudo --check --file=/etc/sudoers.d/jenkins-docker

USER jenkins

COPY --chown=jenkins:jenkins plugins.txt /usr/share/jenkins/ref/plugins.txt

RUN jenkins-plugin-cli \
    --plugin-file /usr/share/jenkins/ref/plugins.txt \
    --latest=false
