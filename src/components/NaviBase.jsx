import React, { useState, Fragment } from "react";
import { Button, ButtonGroup, Divider } from "@blueprintjs/core";
import mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { Joystick } from "react-joystick-component";
/*
    type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";
    export interface IJoystickUpdateEvent {
        type: "move" | "stop" | "start";
        x: number | null;
        y: number | null;
        direction: JoystickDirection | null;
    }
    */
const options = {
  protocol: "ws",
  clientId: uuidv4(),
};
let client = mqtt.connect("ws://192.168.1.11:8083", options);
client.on("connect", function () {
  console.log("connected...");
  client.subscribe("basemove", function (err) {
    if (!err) {
      console.log("subscribe the topic basemove");
    }
  });
});
client.on("message", function (topic, message) {
  console.log(topic);
  const msgString = message.toString();
  console.log(msgString);
  //client.end();
});

const NaviBase = (props) => {
  const [count, setCount] = useState(0);
  const [joytickMove, setJoytickMove] = useState(false);
  const [moveActLog, setMoveActLog] = useState(["init"]);
  const moveCtlAct = {
    //bacis movement control by Joystick
    STOP: "sp",
    FORWARD: "fw",
    BACKWARD: "bw",
    RIGHT: "rp",
    LEFT: "lp",
    // Diagonal movement
    FRONT_RIGHT: "fr",
    FRONT_LEFT: "fl",
    BACK_RIGHT: "br",
    BACK_Left: "bl",
    // Car Center rotate movement
    RIGHT_CENTER_TURN: "rct",
    LEFT_CENTER_TURN: "lct",
    // front wheel center rotate movement
    FRONT_CENTER_RIGHT_TURN: "fcrt",
    FRONT_CENTER_LEFT_TURN: "fclt",
    // back wheel center rotate movement
    BACK_CENTER_RIGHT_TURN: "bcrt",
    BACK_CENTER_LEFT_TURN: "bclt",
    // wheel pivot rotate movement
    BACK_RIGHT_WHEEL_ROTATE: "brwr",
    BACK_LEFT_WHEEL_ROTATE: "blwr",
    FRONT_RIGHT_WHEEL_ROTATE: "frwr",
    FRONT_LEFT_WHEEL_ROTATE: "flwr",
  };

  const sendMoveCmd = (movementKey) => {
    let payload = { data: moveCtlAct[movementKey] };
    client.publish("basemove", JSON.stringify(payload));
    console.log(movementKey, payload);
    pushActionLog(`MoveCmd: ${movementKey}=> '${payload['data']}'`);
  };

  const pushActionLog = (actCmd) => {
    let actlog = moveActLog;
    actlog.push(actCmd);
    setMoveActLog(moveActLog);
    setCount(count + 1);
  };

  const onMoveButtonClick = (movementKey) =>{
    setMoveActLog([movementKey]);
    setCount(count + 1);
    sendMoveCmd(movementKey);
  }

  const handleJoystickStart = (e) => {
    //   console.log(e)
    setMoveActLog([e.type]);
    setJoytickMove(true);
  };
  const handleJoystickMove = (e) => {
    // console.log(e)
    sendMoveCmd(e.direction);
  };
  const handleJoystickStop = (e) => {
    // console.log(e)
    if (joytickMove) {
        // pushActionLog(e.type);
        sendMoveCmd("STOP");
        setJoytickMove(false);
    }
  };

  return (
    <div className="nabibase">
      <div className="app-titel">{"NaviBase Movement Panel"}</div>

      <div className="control-panel">
        <div className="diagonal-button" style={{ top: "50px", left: "50px" }}>
          <Button
            icon="arrow-top-left"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("FRONT_LEFT")}
          />
        </div>

        <div
          className="diagonal-button"
          style={{ top: "0px", left: "calc((100% / 2) - 50px)" }}
        >
          <ButtonGroup>
            <Button
              icon="reset"
              intent="success"
              large={true}
              onClick={() => onMoveButtonClick("LEFT_CENTER_TURN")}
            />
            <Divider />
            <Button
              icon="repeat"
              intent="success"
              large={true}
              onClick={() => onMoveButtonClick("RIGHT_CENTER_TURN")}
            />
          </ButtonGroup>
        </div>

        <div className="diagonal-button" style={{ top: "50px", right: "50px" }}>
          <Button
            icon="arrow-top-right"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("FRONT_RIGHT")}
          />
        </div>

        <div className="main-joystick">
          <Joystick
            size={200}
            baseColor="#587588"
            stickColor="#1e3452"
            move={handleJoystickMove}
            stop={handleJoystickStop}
            start={handleJoystickStart}
            throttle={100}
          ></Joystick>
        </div>

        <div
          className="diagonal-button"
          style={{ bottom: "50px", left: "50px" }}
        >
          <Button
            icon="arrow-bottom-left"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("BACK_Left")}
          />
        </div>

        <div
          className="diagonal-button"
          style={{ bottom: "0px", left: "calc((100% / 2) - 50px)" }}
        >
          <ButtonGroup>
            <Button
              icon="reset"
              intent="success"
              large={true}
              onClick={() => onMoveButtonClick("FRONT_CENTER_LEFT_TURN")}
            />
            <Divider />
            <Button
              icon="repeat"
              intent="success"
              large={true}
              onClick={() => onMoveButtonClick("FRONT_CENTER_RIGHT_TURN")}
            />
          </ButtonGroup>
        </div>

        <div
          className="diagonal-button"
          style={{ bottom: "50px", right: "50px" }}
        >
          <Button
            icon="arrow-bottom-right"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("BACK_RIGHT")}
          />
        </div>

        <div className="side-button" style={{ left: "0px" }}>
          <Button
            icon="reset"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("LEFT_CENTER_TURN")}
          />
        </div>
        <div className="side-button" style={{ right: "0px" }}>
          <Button
            icon="repeat"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("RIGHT_CENTER_TURN")}
          />
        </div>

        {/* wheel pivot rotate movement */}
        <div className="diagonal-button" style={{ top: "0px", left: "0px" }}>
          <Button
            icon="refresh"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("FRONT_LEFT_WHEEL_ROTATE")}
          />
        </div>
        <div className="diagonal-button" style={{ top: "0px", right: "0px" }}>
          <Button
            icon="refresh"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("FRONT_RIGHT_WHEEL_ROTATE")}
          />
        </div>
        <div className="diagonal-button" style={{ bottom: "0px", left: "0px" }}>
          <Button
            icon="refresh"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("BACK_LEFT_WHEEL_ROTATE")}
          />
        </div>
        <div className="diagonal-button" style={{ bottom: "0px", right: "0px" }}>
          <Button
            icon="refresh"
            intent="success"
            large={true}
            onClick={() => onMoveButtonClick("BACK_RIGHT_WHEEL_ROTATE")}
          />
        </div>
      </div>

      <div className="movement-log">
        {moveActLog.map((log, ikey) => (
          <p key={ikey}>{log}</p>
        ))}
      </div>
    </div>
  );
};
export default NaviBase;
