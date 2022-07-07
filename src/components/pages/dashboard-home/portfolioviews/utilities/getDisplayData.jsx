const DisplayData = (props) => {
    var DynamicPost = []
    const DynamicData = props.Data
    for (var Datas in DynamicData) {
       DynamicPost.push([
          <>
             <tr className='table-title'>
                <td>{DynamicData[Datas]["floorName"]}</td>
                <td className='text-end'>{DynamicData[Datas]["time"]}</td>
             </tr>
             <tr>
                <td colSpan={2}>{DynamicData[Datas]["SensorName"]} / {DynamicData[Datas]["description"]}</td>
             </tr>
          </>

       ]);
    }
    return DynamicPost
 }

 export default DisplayData;