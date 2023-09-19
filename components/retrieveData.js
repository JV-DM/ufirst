"use server";
import json from "/uploads/log_data.json";
export async function retrieveData() {
  return json;
}
