import API from '../../utils/apiUtils';


export const fetchIotDevices = function(portfolio, userToken){
    return API.getIotDevices(
        userToken,
        portfolio.portfolioHeaderId
    );
}


export const handleFilterLoadingAsync = (fn, setLoading) => {
    setLoading(true);

    return fn()
    .then(res=>{
        setLoading(false);
        return res;
    })
    .catch(err=>{
        setLoading(false);
        throw err;
    });
}