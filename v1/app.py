from typing import Set, Dict

import tornado.ioloop
import tornado.web
import tornado.websocket

import os
import uuid
import logging
logging.basicConfig(level = logging.DEBUG)

PORT = 8888

class HealthCheckHandler(tornado.web.RequestHandler):
    def get(self):
        logging.info("Health Check")
        self.write("ok")

class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters: Set[tornado.websocket.WebSocketHandler] = set()
    session_id: str = ""

    def open(self):
        ChatSocketHandler.waiters.add(self)

    def on_close(self):
        leaving_chat = {"id": self.session_id, "x": -1, "y": -1, "name": ""}
        ChatSocketHandler.send_updates(leaving_chat)

        ChatSocketHandler.waiters.remove(self)

    def on_message(self, message):
        message: Dict = tornado.escape.json_decode(message)

        chat: Dict = self._parse_message(message)
        if len(chat) == 0:
            return

        self.session_id = chat["id"]
        ChatSocketHandler.send_updates(chat)


    def _parse_message(self, message: Dict) -> Dict:
            id = message.get("id")
            if not id:
                return {}

            x = message.get("x")
            y = message.get("y")
            name = message.get("displayName")

            if not x or not y:
                x = 0
                y = 0

            if not name:
                name = "Guest"

            return {"id": id, "x": x, "y": y, "name": name}

    @classmethod
    def send_updates(cls, chat: Dict):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(chat)
            except:
                logging.error("Error sending message", exc_info=True)

def make_app() -> tornado.web.Application:
    build_path = os.path.join(os.path.dirname(__file__),  '../frontend/build/')
    css_path = os.path.join(build_path, 'static/css')
    js_path = os.path.join(build_path, 'static/js')


    app = tornado.web.Application([
        (r"/health", HealthCheckHandler),
        (r"/chat", ChatSocketHandler),

        (r"/static/js/(.*)", tornado.web.StaticFileHandler, {"path": js_path}),
        (r"/static/css/(.*)", tornado.web.StaticFileHandler, {"path": css_path}),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": build_path, "default_filename": "index.html"})
        # (r"/static/lib/(.*)", tornado.web.StaticFileHandler, {"path": node_modules}),

    ])
    # app.settings["static_path"] = path
    return app

if __name__ == "__main__":
    logging.info(f'Starting app at port {PORT}')
    app = make_app()

    
    app.listen(PORT)
    tornado.ioloop.IOLoop.current().start()