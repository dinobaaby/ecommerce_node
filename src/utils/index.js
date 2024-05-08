"use strict";

const _ = require("lodash");
const { default: mongoose, Types } = require("mongoose");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUnderfinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray()) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((r) => {
        final[`${k}.${r}`] = response[r];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

const convertToObjectIdMongodb = (Id) => new Types.ObjectId(Id);

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUnderfinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
