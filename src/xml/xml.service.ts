import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';
import * as fs from 'fs';

@Injectable()
export class XmlService {

    async xlmToJson(type:string) {
        const filePath = path.join(__dirname, '../../../public/db-config.xml');
        console.log(filePath);
        try {
            const xmlData = await fs.promises.readFile(filePath, 'utf-8');
            const result = await parseStringPromise(xmlData)
            let configType = type === 'mssql' ? 'MssqlConfig' : type === 'mysql' ? 'MysqlConfig' : 'OracleConfig';
            let res = await this.findElement(result, configType);
            let output = await this.dataSourceOptionsFormat(await this.dataSourceOptionsFormat(res[0]))
            console.log(output);
            console.log(JSON.parse(JSON.stringify((output))));
            return (JSON.parse(JSON.stringify((output))))
            // return res[0];
        } catch (error) {
            console.log(error);
            console.log("parsing xml error");
            return 'error occured for xml to json'
        }

    }

    async dataSourceOptionsFormat(obj: any) {
        const k: any = {}; // Initialize an empty object to hold the results
    
        // Helper function to process each property
        const processProperty = (value: any) => {
            if (Array.isArray(value)) {
                return value[0]; // If it's an array, return the first element
            } else if (typeof value === 'object' && value !== null) {
                // If it's an object, recursively process its properties
                const nestedResult: any = {};
                for (const nestedKey in value) {
                    if (value.hasOwnProperty(nestedKey)) {
                        nestedResult[nestedKey] = processProperty(value[nestedKey]); // Process each nested property
                    }
                }
                return nestedResult; // Return the processed nested object
            }
            return value; // Return the value as is if it's neither an array nor an object
        };
    
        // Iterate over the properties of the main object
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) { // Check if the property is a direct property of the object
                k[key] = processProperty(obj[key]); // Process each property
            }
        }
    
        return k; // Return the resulting object
    }

    async findElement(obj: any, elementName: string) {
        if (obj[elementName]) {
            return obj[elementName];
        }

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const result = this.findElement(obj[key], elementName);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    }
}
