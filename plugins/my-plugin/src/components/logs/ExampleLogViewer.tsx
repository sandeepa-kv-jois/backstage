import React, { useState } from 'react';
import { LogViewer } from '@backstage/core-components';
import type { LogSectionData, LogLineData } from './types'
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const formatDatetoLocale = (date: number | string): string => {
  return `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`
}
function sanitizeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/\u00a0/g, ' ')
}


function processLogsData(data: string): LogLineData[] {
  return String(data)
    .split('\n')
    .reduce<LogSectionData['data']>((accumulator, line) => {
      /* istanbul ignore else */
      if (line.length > 0) {
        try {
          const { level, time, out } = JSON.parse(line) as Record<string, string>

          accumulator.push({
            text: {
              level: sanitizeHTML(level),
              time: formatDatetoLocale(time),
              out: sanitizeHTML(out)
            }
          })
        } catch (e) {
          //
        }
      }

      return accumulator
    }, [])
}
function ExampleLogViewer(row : any){
    const configApi = useApi(configApiRef);
    const backendUrl = configApi.getString('backend.baseUrl');
    const [log,setLog]=useState("");
        async function run() {
        let queryParam : string = "";

        const splitString = String(row.row.baseFqn).split(".");
        splitString.map((level, index) => {
          const temp = `/level${index}:${level}`
          queryParam = queryParam + temp;
        })
      
        
        const response = await fetch(`${backendUrl}/api/proxy/harness/gateway/log-service/blob?accountID=dh-iBL35SqqpuqJF0yDjpQ&X-Harness-Token=&key=accountId:dh-iBL35SqqpuqJF0yDjpQ/orgId:default/projectId:CIQuickstart/pipelineId:${row.row.pipelineIdentifier}/runSequence:${row.row.runSequence}${queryParam}`);
        const data = await response.text();
        setLog(data);
        };
        run();
        let arr=[];
        arr=processLogsData(log);
        let i=0;
        let finalLog='';
        while(i<arr.length)
        {
          finalLog+=arr[i].text.level+"\t"+arr[i].text.time+"\t\t"+arr[i].text.out+"";
          i++;
        }
    return  <div style={{ height: '20vh', width: '100%' }}>
    <LogViewer text={finalLog} />
  </div>
};

export default ExampleLogViewer;
