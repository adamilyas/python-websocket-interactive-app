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
        self.session_id = str(uuid.uuid4())
        ChatSocketHandler.waiters.add(self)
        

    def on_close(self):
        session_id = self.session_id
        leaving_chat = {"id": session_id, "x": -1, "y": -1, "name": ""}
        ChatSocketHandler.send_updates(leaving_chat, session_id)

        ChatSocketHandler.waiters.remove(self)

    def on_message(self, message):
        message: Dict = tornado.escape.json_decode(message)

        chat: Dict = self._parse_message(message)
        if len(chat) == 0:
            return

        ChatSocketHandler.send_updates(chat, self.session_id)


    def _parse_message(self, message: Dict) -> Dict:

            x = message.get("x")
            y = message.get("y")
            name = message.get("displayName")

            if not x or not y:
                x = 0
                y = 0

            if not name:
                name = "Guest"

            return {"id": self.session_id, "x": x, "y": y, "name": name}

    @classmethod
    def send_updates(cls, chat: Dict, sender_session_id: str):
        """sends chat message to all except the sender (denoted by sender_session_id)

        Args:
            chat   : Oncoming message in the form of a Dict
            param2 : sender_session_id
        """
        for waiter in cls.waiters:
            if waiter.session_id == sender_session_id:
                continue # dont send the sender
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

    ])
    return app

if __name__ == "__main__":
    logging.info(f'Starting app at http://localhost:{PORT}')
    app = make_app()
    app.listen(PORT)
    tornado.ioloop.IOLoop.current().start()