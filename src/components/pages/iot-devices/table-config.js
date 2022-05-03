import * as strUtils from '../../../utils/stringUtils';

export const tableFields = [
    'floor',
    'location',
    'serial number',
    'device type',
    'status',
    'date created'
];

export const formattedFloorName = (floorId) => {
    let s = ["th", "st", "nd", "rd"];
    let v = floorId%100;
    return floorId + (s[(v-20)%10] || s[v] || s[0]) + ' Floor';
}

const formattedDeviceState = (statusId) => {
    let statusDesc, color;
    switch(statusId) {
        case 1: {
            color='green';
            statusDesc ='Online';
            break;
        }
        case 2: {
            color='red';
            statusDesc ='Offline';
            break;
        }
        case 3: {
            color='grey';
            statusDesc ='Unknown';
            break;
        }
        case 4: {
            color='grey';
            statusDesc ='Never Connected';
            break;
        }
        default: return ''; 
    }
    let html_element = <><i className="bi bi-circle-fill" style={{color:`${color}`}} ></i>&nbsp;&nbsp;{statusDesc}</>;
    return html_element;
}

export const tableColumns = tableFields.map(field => {
    const   column ={
        name: strUtils.toCamelCase(field),
        label: strUtils.toTitleCase(field)
   };
   switch (field){
        case 'floor':{
            column.options={
                customCellRender:(value, record, metadata)=>{
                    return formattedFloorName(value)
                }
            }
            break;
        }
       case 'location' :{
           column.options={
                customCellRender:(value, record, metadata)=>{
                    return (<div className="overflow-x-scroll thin-scrollbar">{value}</div>);
                }
           }
           break;
       }
       case 'status':{
            column.options={
                customCellRender:(value, record, metadata)=>{
                    return formattedDeviceState(value)
                }
            }
            break;
        }
   }
   return column;
});
export const getTableData = iotDevices => {
    if (!iotDevices?.length) return [];
    return iotDevices.map(device => ({
        'floor': `${device.floorHeaderId}`,
        'location': `${device.roomName} / ${device.zoneName}`,        
        'serialNumber': device.serialNumber,
        'deviceType':device.model,
        'status':device.sensorStatusId,
        'dateCreated':device.manufacturedDate
    }));
};

export const getFilterPeriods = devices => {
    let filterOptions = ['All'];
    const filterColumn = 'floor'
    devices.map(device=>{
        if (!filterOptions.includes(formattedFloorName(device[filterColumn])))
            filterOptions.push(formattedFloorName(device[filterColumn]))
        return ()=> {};
    });
    return filterOptions;
}
