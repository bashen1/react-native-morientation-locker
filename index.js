//
//  react-native-orientation-locker
//
//
//  Created by Wonday on 17/5/12.
//  Copyright (c) wonday.org All rights reserved.
//

"use strict";
import React, {Component} from "react";

const OrientationNative = require("react-native").NativeModules.Orientation;
const {NativeEventEmitter, Platform} = require("react-native");
const LocalEventEmitter = new NativeEventEmitter(OrientationNative);

var listeners = {};

var id = 0;
var META = "__listener_id";

var locked = false;

function getKey(listener) {
    if (!listener.hasOwnProperty(META)) {
        if (!Object.isExtensible(listener)) {
            return "F";
        }
        Object.defineProperty(listener, META, {
            value: "L" + ++id
        });
    }
    return listener[META];
}

export default class Orientation {
    static init = () => {
        if (Platform.OS === "android") {
            OrientationNative.init();
        }
    }

    static getOrientation = cb => {
        OrientationNative.getOrientation(orientation => {
            cb(orientation);
        });
    };

    static getDeviceOrientation = cb => {
        OrientationNative.getDeviceOrientation(deviceOrientation => {
            cb(deviceOrientation);
        });
    };

    static isLocked = () => {
        return locked;
    }

    static lockToPortrait = () => {
        locked = true;
        OrientationNative.lockToPortrait();
    };

    static lockToPortraitUpsideDown = () => {
        locked = true;
        OrientationNative.lockToPortraitUpsideDown();
    };

    static lockToLandscape = () => {
        locked = true;
        OrientationNative.lockToLandscape();
    };

    static lockToLandscapeRight = () => {
        locked = true;
        OrientationNative.lockToLandscapeRight();
    };

    static lockToLandscapeLeft = () => {
        locked = true;
        OrientationNative.lockToLandscapeLeft();
    };

    static unlockAllOrientations = () => {
        locked = false;
        OrientationNative.unlockAllOrientations();
    };

    static addOrientationListener = cb => {
        var key = getKey(cb);
        listeners[key] = LocalEventEmitter.addListener(
            "orientationDidChange",
            body => {
                cb(body.orientation);
            }
        );
    };

    static removeOrientationListener = cb => {
        var key = getKey(cb);
        if (!listeners[key]) {
            return;
        }
        listeners[key].remove();
        listeners[key] = null;
    };

    static addDeviceOrientationListener = cb => {
        var key = getKey(cb);
        listeners[key] = LocalEventEmitter.addListener(
            "deviceOrientationDidChange",
            body => {
                cb(body.deviceOrientation);
            }
        );
    };

    static removeDeviceOrientationListener = cb => {
        var key = getKey(cb);
        if (!listeners[key]) {
            return;
        }
        listeners[key].remove();
        listeners[key] = null;
    };

    static addLockListener = cb => {
        var key = getKey(cb);
        listeners[key] = LocalEventEmitter.addListener(
            "lockDidChange",
            body => {
                cb(body.orientation);
            }
        );
    };

    static removeLockListener = cb => {
        var key = getKey(cb);
        if (!listeners[key]) {
            return;
        }
        listeners[key].remove();
        listeners[key] = null;
    };

    static removeAllListeners = () => {
        for(var key in listeners){
            if (!listeners[key]) {
                continue;
            }
            listeners[key].remove();
            listeners[key] = null;
        }
    };

    static getInitialOrientation = () => {
        return OrientationNative.initialOrientation;
    };

    static getAutoRotateState = cb => {
        if (Platform.OS === "android") {
            OrientationNative.getAutoRotateState(state => {
                cb(state);
            });
        } else {
            cb(true); // iOS not implement
        }
    };
}
