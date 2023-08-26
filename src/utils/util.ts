/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method formatDate
 * @param {String } date
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const formatDate = (date:Date): string => {
  const unixTime = date.getTime();
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const formattedDate = `/Date(${unixTime + timeZoneOffset})/`;
  return formattedDate;
};
/**
 * @method generateOrderNumber
 * @param {number } length
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const generateOrderNumber = (length:number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charLength = characters.length;

  let orderNumber = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    orderNumber += characters.charAt(randomIndex);
  }

  return orderNumber;
};

/**
 * @method localeDateString
 * @param {number } length
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const localeDateString = (departureDateString: string): string => {
    const dateObject = new Date(departureDateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @method toISOString
 * @param {number } length
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const toISOString = (departureDateString: string): string => {
   const dateObject = new Date(departureDateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
/**
 * @method formattedTime
 * @param {string } length
 * @returns {string} true & false
 * @description this value is Empty Check
 */
export const formattedTime = (timestamp: string): string => { 
  const dateObject = new Date(timestamp);
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

/**
 * @method extractKeyValuePairs
 * @param {string } length
 * @returns {string} true & false
 * @description this value is Empty Check
 */
export const extractKeyValuePairs = (inputString: string): Array<any> => { 
  let keyValuePairs = [];
  let match;
  // Regular expression to match the key-value pairs
  const regex = /<li><i class="material-icons">(\w+)<\/i>([^<]*)<\/li>/g;
  while ((match = regex.exec(inputString)) !== null) {
      const key = match[1];
      const value = match[2].trim();
      keyValuePairs.push({ key, value });
  }
  return keyValuePairs;
}


/**
 * @method createListView
 * @param {HTMLUListElement } length
 * @returns {HTMLElement} Html
 * @description this value is Empty Check
 */
export const parseChildren = (children: any): any => { 

      return children.map(child => {
        const parsedChild = {
            Text: child.Text,
            Value: child.Value,
            Children: parseChildren(child.Children),
            Extensions: null
        };
        return parsedChild;
    }); 
};


 
 