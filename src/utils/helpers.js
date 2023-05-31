const XLSX = require('xlsx');


const sourceWithType = (sFN, sC) => {
    const workbook = XLSX.readFile(__dirname + `/../data/${sFN}.csv`);

    const worksheet = workbook.Sheets['Sheet1'];
    const lastbox = worksheet['!ref'].split(':')[1];
    const totalUnits = parseInt(lastbox.match(/\d+/)[0]);
    const data = [];

    for (let i = 2; i <= totalUnits; i++) {
        const stock = worksheet['J' + i]?.v;
        const manufacturer = worksheet[`${sC}` + i]?.v;
        data.push({ stock, manufacturer });
    }
    return data;
}

const destinationWithType = (dFN, dC) => {
    const workbook = XLSX.readFile(__dirname + `/../data/${dFN}.csv`);

    const worksheet = workbook.Sheets['Sheet1'];
    const lastbox = worksheet['!ref'].split(':')[1];
    const totalUnits = parseInt(lastbox.match(/\d+/)[0]);
    const data = [];

    for (let i = 2; i <= totalUnits; i++) {
        const stock = worksheet['A' + i]?.v;
        const manufacturer = worksheet[`${dC}` + i]?.v;
        data.push({ stock, manufacturer });
    }
    return data;
}



const getCompleteMappings = () => {
    const data = [];
    const workbook = XLSX.readFile(__dirname + '/../data/dim.xlsx');

    const totalmappings = workbook['Sheets'];
    const mappingobjs = totalmappings['Worksheet'];


    const lastbox = mappingobjs['!ref'].split(':')[1];
    const totalUnits = parseInt(lastbox.match(/\d+/)[0]);

    for (let i = 2; i <= totalUnits; i++) {
        const id = mappingobjs['A' + i]?.v;
        const srcField = mappingobjs['B' + i]?.v;
        const destField = mappingobjs['C' + i]?.v;
        const type = mappingobjs['D' + i]?.v;
        data.push({ id, srcField, destField, type });
    }
    return data;
}

const filterMappingsByIdAndType = (id, type) => {

    const d_id = parseInt(id);

    const mappings = getCompleteMappings();
    return mappings.filter(mapping => {
        const isMatchingType = mapping.type === type;
        const isMatchingId = mapping.id === d_id || mapping.id === undefined;

        return isMatchingType && isMatchingId;
    });
}


const getMergedData = (obj, cb) => {

    const validationMethod = obj.vM;
    const srcData = sourceWithType(obj.sFN, obj.sC);
    const destData = destinationWithType(obj.dFN, obj.dC);
    const mappings = filterMappingsByIdAndType(obj.id, obj.mT);

    mappings.sort((a, b) => {
        if (typeof a.id === "number" && typeof b.id === "undefined") {
            return -1; // `a` has numeric ID, `b` has undefined ID, so `a` comes first
        } else if (typeof a.id === "undefined" && typeof b.id === "number") {
            return 1; // `b` has numeric ID, `a` has undefined ID, so `b` comes first
        } else {
            return 0; // Both `a` and `b` have either numeric IDs or undefined IDs, maintain the original order
        }
    });
    console.log(mappings.length);


    const result = srcData.map((srcObj, index) => {
        const destObj = destData.find(destObj => destObj.stock === srcObj.stock);
        const isFound = Boolean(destObj);
        const manufacturerInSrc = srcObj.manufacturer || ''; //2020
        const manufacturerInDest = isFound ? destObj.manufacturer : ''; //2020

        let mappingObj;
        let mapping;
        if (validationMethod === 'mappings') {
            mappingObj = mappings.find(mappingObj => mappingObj.srcField.toString().toLowerCase() === manufacturerInSrc.toLowerCase());
            mapping = mappingObj ? `${mappingObj.srcField} → ${mappingObj.destField}` : '';
        } else {
            mapping = '-';
        }


        let issue;

        if (validationMethod === 'mappings') {
            issue = (mappingObj && mappingObj.destField !== manufacturerInDest) ? true : false;
        } else {
            issue = (manufacturerInSrc !== manufacturerInDest) ? true : false;
        }



        return {
            ndx: index + 1,
            stock: srcObj.stock,
            is_found: isFound,
            manufacturer_in_src: manufacturerInSrc,
            manufacturer_in_dest: manufacturerInDest,
            mapping: mapping,
            issue: issue
        };
    });

    cb(undefined, result);


}







module.exports = {
    getMergedData
};