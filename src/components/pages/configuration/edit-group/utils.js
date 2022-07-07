export const getIncidentTypeOptions = incidents => {
   if (!incidents?.length) return [];
   return incidents.map(incid => ({
      label: incid.name,
      value: incid.incidentTypeId,
   }));
};

export const getNotificationOptions = notifs => {
   if (!notifs?.length) return [];
   return notifs.map(notif => ({
      label: notif.name,
      value: notif.notificationTypeId,
   }));
};

export const getAvailabilityOptions = avails => {
   if (!avails?.length) return [];
   return avails.map(av => ({
      label: av.name,
      value: av.availabilityId,
   }));
};

export const getSelectedValues = options => {
   return options?.map(optn => optn.value);
};
