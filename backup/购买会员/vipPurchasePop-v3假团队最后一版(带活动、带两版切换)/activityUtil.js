const ACTIVITY_END_TIME = (new Date('Jun 15 2020 00:00:00 GMT+0800')).getTime();

export const getActivityRemainTime = serverDate => {
  if (!serverDate) return 0;

  const serverTime = (new Date(serverDate)).getTime();

  const remainTime = ACTIVITY_END_TIME - serverTime;

  return remainTime > 0 ? remainTime : 0;
};
