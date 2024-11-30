import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import {prisma} from "@repo/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "./config";

function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// ---------------------- USER ---------------------------

/*
1. User joins the space -> get spawned at random location within the space, -> Leavers the space
roommanger broadcasts in the space that user has joined.
2. User tries to move in the space, either movement will happen or movement will be rejected by the server
*/

export class User {
    public id: string;
    public userId?: string;
    private spaceId?: string;
    private x: number;
    private y: number;
    private ws: WebSocket;

    constructor(ws: WebSocket) {
        this.id = getRandomId();
        this.x = 0;
        this.y = 0;
        this.ws = ws;
        this.initHandlers()
    }

    initHandlers() {
        this.ws.on("message", async (data) => {
            console.log(data)
            const parsedData = JSON.parse(data.toString());
            console.log(parsedData)
            console.log("parsedData")
            switch (parsedData.type) {
                case "join":
                    const spaceId = parsedData.payload.spaceId;
                    const token = parsedData.payload.token;
                    const userId = (jwt.verify(token, config.JWT_SECRET) as JwtPayload).userId
                    if (!userId) {
                        this.ws.close()
                        return
                    }
                    this.userId = userId
                    const space = await prisma.space.findFirst({
                        where: {
                            id: spaceId
                        }
                    })
                    if (!space) {
                        this.ws.close()
                        return;
                    }
                    this.spaceId = spaceId
                    RoomManager.getInstance().addUser(spaceId, this);
                    this.x = Math.floor(Math.random() * space?.width);
                    this.y = Math.floor(Math.random() * space?.height);
                    this.send({
                        type: "space-joined",
                        payload: {
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id)?.map((u) => ({id: u.id})) ?? []
                        }
                    });
                    RoomManager.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!);
                    break;
                case "move":
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    if ((xDisplacement == 1 && yDisplacement== 0) || (xDisplacement == 0 && yDisplacement == 1)) {
                        this.x = moveX;
                        this.y = moveY;
                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        }, this, this.spaceId!);
                        return;
                    }
                    
                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                    });
                    
            }
        });
    }

    destroy() {
        RoomManager.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId
            }
        }, this, this.spaceId!);
        RoomManager.getInstance().removeUser(this, this.spaceId!);
    }

    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
}