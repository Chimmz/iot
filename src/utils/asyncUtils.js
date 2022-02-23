import AppError from './AppError';

export const timeout = function (duration) {
   const callback = reject =>
      reject(
         new AppError('The server is taking too long to respond', 404, 'client')
      );

   const fn = (_, reject) => {
      setTimeout(() => callback(reject), duration);
   };

   return new Promise(fn);
};

export const getResponseWithinTimeout = async (request, duration = 15000) => {
   const response = await Promise.race([request, timeout(duration)]);
   return response;
};

export const handleLoadingStateAsync = async function (...params) {
   const [fn, setIsLoading, dispatch] = params;
   dispatch(setIsLoading(true));

   return fn()
      .then(res => {
         dispatch(setIsLoading(false));
         return res;
      })
      .catch(err => {
         dispatch(setIsLoading(false));
         return err;
      });
};
