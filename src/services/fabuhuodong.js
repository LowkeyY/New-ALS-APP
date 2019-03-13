import { request, config } from 'utils';

const { api } = config;
const { Getfabuhuodong, Getbangfuduixiang, Postfabuhuodong } = api;

export async function Fabuhuodong (payload) {
  return request({
    url: Getfabuhuodong,
    method: 'get',
    data: payload
  });
}

export async function Bangfuduixiang (payload) {
  return request({
    url: Getbangfuduixiang,
    method: 'post',
    data: payload,
  });
}

export async function submitHuodong (payload) {
  return request({
    url: Postfabuhuodong,
    method: 'post',
    data: payload,
  });
}
