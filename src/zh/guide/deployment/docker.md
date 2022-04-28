# Docker 部署(Docker Deployment)

## 介绍(introduction)

在服务器中构建 Sanic 所需的运行环境是一件麻烦事，您首先需要构建 Python3，其次安装相关的依赖。但是使用 docker 可以轻松的解决这些问题，如果您不了解 docker，可以先去[官方网站](https://www.docker.com/)了解相关信息



## 构建镜像

我们以一个最简单的 Sanic 工程作为例子。假设项目`SanicDocker` 的路径是`/path/to/SanicDocker`

```
# /path/to/SanicDocker
SanicDocker
├── dockerfile
└── server.py
```

`server.py`代码如下：

```python
# ignore import
app = Sanic("MySanicApp")

@app.get('/')
async def hello(request):
    return text("OK!")

if __name__ == '__main__':
    # 请注意这里的 host 不能为 127.0.0.1
    # 在 docker 容器中，127.0.0.1 只表示本机本容器中的一个虚拟网卡，只接受本容器中的应用相互通讯
    app.run(host='0.0.0.0', port=9999, debug=False, access_log=False)

```

Sanic 服务器将会监听本地`9999`端口，同时关闭了`debug`和`access_log`

`dockerfile`中的内容如下：

```dockerfile
# Python3.7+
FROM python:3.8
# 工作目录
WORKDIR /sanic
# 将当前工程目录下的所有文件拷贝到容器的工作目录
COPY . .
# 查找python项目依赖并生成requirements.txt到当前目录
# 如果pip下载过慢，可以换源
# RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ pipreqs
RUN pip install pipreqs 
RUN pipreqs .
# 安装依赖，下面注释为使用清华源安装依赖的方式
RUN pip install -r requirements.txt
# 暴露 9999 端口
EXPOSE 9999
# 容器启动后运行 Sanic 服务
CMD ["python", "server.py"]
```

接着，在工程目录下，使用`docker build -t sanic .`构建镜像，稍等片刻，一个名为`sanic`的镜像就构建完成了

> `docker images`即可查看所有的镜像



## 启动容器

接下来，我们将用构建好的`sanic`镜像来启动容器

```shell
docker run --name mysanic -p 9999:9999 -d sanic
```

使用`sanic`镜像启动了一个名为`mysanic`的容器，该容器将宿主机的 9999 端口映射到容器内的 9999 端口。

> `docker container ls`即可查看当前的所有容器

此时，在浏览器中访问`http://localhost:9999/`即可看见 Sanic 服务器返回的`OK!`



## Nginx反向代理

如果使用`docker`构建的`nginx`，请将`nginx`和`sanic`应用放在同个网段下（否则会出现 502 错误）。

假设存在容器`mynginx`和`mysanic`，创建一个名为`sanic`的网络

```shell
docker network create sanic
```

并将两个容器加入`sanic`网络中

```shell
docker network connect mynginx sanic
docker network connect mysanic sanic
```

注意：请修改您的`nginx`配置文件，重启`nginx`后反向代理即可成功。


