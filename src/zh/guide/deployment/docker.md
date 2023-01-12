# Docker 部署(Docker Deployment)

## 介绍(Introduction)

长期以来，环境一直是部署的难题。 如果您的项目中有冲突的配置，您将不得不花费大量时间来解决它们。 幸运的是，虚拟化为我们提供了一个很好的解决思路。 Docker 就是其中之一。 如果您不了解 Docker，可以访问 [Docker 官网](https://www.docker.com/) 了解更多。

## 构建镜像(Build Image)

Let's start with a simple project. 我们以一个最简单的 Sanic 工程作为例子。 假设项目`SanicDocker` 的路径是`/path/to/SanicDocker`。

---:1

目录结构如右侧所示：

:--:1

```text
# /path/to/SanicDocker
SanicDocker
├── requirements.txt
├── dockerfile
└── server.py
```

:---

---:1

`server.py`代码如右侧所示：

:--:1

```python
app = Sanic("MySanicApp")

@app.get('/')
async def hello(request):
    return text("OK!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

:---

::: tip 小提示

请注意这里的 host 不能为 127.0.0.1 。 在 docker 容器中，127.0.0.1 只表示本机本容器中的一个虚拟网卡，只接受本容器中的应用相互通讯。 更多信息请参考 [Docker 网络](https://docs.docker.com/engine/reference/commandline/network/)

:::

代码准备好后，我们编写 `Dockerfile` 文件，其内容如下：

```Dockerfile

FROM sanicframework/sanic:3.8-latest

WORKDIR /sanic

COPY . .

FROM sanicframework/sanic:3.8-latest

WORKDIR /sanic

COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "server.py"]
```

运行下面的命令，构建镜像：

```shell
docker build -t my-sanic-image .
```

## 启动容器(Start Container)

---:1

构建完镜像，我们将用构建好的 `my-sanic-image` 镜像来启动容器。

:--:1

```shell
docker run --name mysanic -p 8000:8000 -d my-sanic-image
```

:---

---:1

此时，在浏览器中访问 `http://localhost:8000/` 即可看见 Sanic 服务器的返回结果

:--:1

```text
OK!
```

:---

## 使用 docker-compose 编排(Use docker-compose)

当您的项目中涵盖了多个不同的组件或服务时，您可以使用 [docker-compose](https://docs.docker.com/compose/) 来编排容器。

首先我们需要准备 nginx 的配置文件，将其命名为 `mysanic.conf` 并写入内容：

---:1

First of all, we need prepare nginx configuration file. create a file named `mysanic.conf`:

:--:1

```nginx
server {
    listen 80;
    listen [::]:80;
    location / {
      proxy_pass http://mysanic:8000/;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
}
```

:---

---:1

然后我们来准备 `docker-compose.yml` 文件，其内容为： The content follows:

:--:1

```yml
version: "3"

services:
  mysanic:
    image: my-sanic-image
    ports:
      - "8000:8000"
    restart: always

  mynginx:
    image: nginx:1.13.6-alpine
    ports:
      - "80:80"
    depends_on:
      - mysanic
    volumes:
      - ./mysanic.conf:/etc/nginx/conf.d/mysanic.conf
    restart: always

networks:
  default:
    driver: bridge
```

:---

---:1

接下来我们来启动容器：

:--:1

```shell
docker-compose up -d
```

:---

---:1

此时，在浏览器中访问 `http://localhost:80/` 即可看见 Sanic 服务器的返回结果

:--:1

```text
OK!
```

:---
