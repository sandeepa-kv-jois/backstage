import React, { useEffect, useState } from 'react';
import { Box, IconButton, Link, makeStyles, Typography } from '@material-ui/core';
import { StatusError, StatusOK, StatusPending, StatusRunning, StatusWarning, Table, TableColumn } from '@backstage/core-components';
import ReplayIcon from '@material-ui/icons/Replay';
import { useEntity } from "@backstage/plugin-catalog-react";
import { Link as RouterLink } from 'react-router-dom';
import { harnessCIBuildRouteRef } from '../../route-refs';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useApi, configApiRef } from '@backstage/core-plugin-api';


const getStatusComponent = (status: string | undefined = '') => {
  switch (status.toLocaleLowerCase('en-US')) {
    case 'queued':
    case 'scheduled':
      return <StatusPending />;
    case 'running':
      return <StatusRunning />;
    case 'failed':
      return <StatusError />;
    case 'success':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusWarning />;
  }
};


interface TableData {
  id: string,
  name: string,
  status: string,
  startTime: string,
  endTime: string,
  pipelineId: string,
  planExecutionId: string,
}


function runPipeline(pipelineId : TableData,backendUrl: string ): void
  {
    fetch(`${backendUrl}/api/proxy/harness/gateway/pipeline/api/pipeline/execute/${pipelineId.pipelineId}?routingId=dh-iBL35SqqpuqJF0yDjpQ&accountIdentifier=dh-iBL35SqqpuqJF0yDjpQ&projectIdentifier=CIQuickstart&orgIdentifier=default&moduleType=ci`, {
      "headers": {
        "content-type": "application/yaml",
      },
      "body": `pipeline:\n    identifier: ${pipelineId.pipelineId}\n    properties:\n        ci:\n            codebase:\n                build:\n                    type: branch\n                    spec:\n                        branch: main\n`,
      "method": "POST",

    });
  }



const useStyles = makeStyles(theme => ({
  container: {
    width: 1250,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

function MyComponent() {
  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');
  const [tableData, setTableData] = useState();
  const classes = useStyles();
  const columns: TableColumn[] = [
    {
      title: 'ID',
      field: 'id',
      highlight: true,
      type: 'numeric',
      width: '80px',
      },
    {
      title: 'Pipeline Name',
      field: 'col1',
      highlight: true,
      render: (row : Partial<TableData>) => {
        const LinkWrapper = () => {
          const routeLink = useRouteRef(harnessCIBuildRouteRef);
          return (
            <Link
              component={RouterLink}
              to={`${routeLink({
                buildId: row.planExecutionId!.toString(),
              })}`}
            >
              {row.name}
            </Link>
          );
        };
  
        return (
          <LinkWrapper />
        )
      },
    },
    {
      title: 'Pipeline Status',
      field: 'col2',
      render: (row : Partial<TableData>) => (
        <Box display="flex" alignItems="center">
          {getStatusComponent(row.status)}
          <Box mr={1} />
          <Typography variant="button">{row.status}</Typography>
        </Box>
      ),
    },
    {
      title: 'Pipeline Start Time',
      field: 'col3',
      type: 'date',
      render: (row : Partial<TableData>) => (
        <Typography>{new Date(Number(row.startTime)).toLocaleString()}</Typography>
      ),
    },
    {
      title: 'Pipeline End Time',
      field: 'col4',
      type: 'date',
      render: (row : Partial<TableData>) => (
        <Typography>{row.endTime ? new Date(Number(row.endTime)).toLocaleString() : "Pipeline is Running"}</Typography>
      ),
    },
    {
      title: 'Run Pipeline',
      field: 'col5',
      render: (row : Partial<TableData>) => (
        <div>
          <IconButton aria-label="replay" onClick={() => runPipeline(Object(row),backendUrl)}>
            <ReplayIcon/>
          </IconButton>
        </div>
        

      ),
    },
  ];
  const{ entity } = useEntity();
  const projectid = 'projectIdentifier';
  const orgid = 'orgIdentifier';
  const accid = 'accountIdentifier';
    
  useEffect(() => {
    async function run() {
      const query = new URLSearchParams({
        accountIdentifier: `${entity.metadata.annotations?.[accid]}`,
        routingId: `${entity.metadata.annotations?.[accid]}`,
        orgIdentifier: `${entity.metadata.annotations?.[orgid]}`,
        projectIdentifier: `${entity.metadata.annotations?.[projectid]}`,
        size: '50',
      }).toString();
      const response = await fetch(`${backendUrl}/api/proxy/harness/gateway/pipeline/api/pipelines/execution/summary?${query}`, {
        "method": "POST",
      });
      const data = await response.json();     
      setTableData(data.data.content);
    }
    run();
  }, []);
  

  const generateTestData: (number: number) => Array<{}> = (rows = 10) => {
    const data1: Array<TableData> = [];
    while (data1.length < rows && tableData) {
      data1.push({
        id: `${data1.length}`,
        name: `${tableData[data1.length]['name']}`,
        status: `${tableData[data1.length]['status']}`,
        startTime: `${tableData[data1.length]['startTs']}`,
        endTime: `${tableData[data1.length]['endTs']}`,
        pipelineId: `${tableData[data1.length]['pipelineIdentifier']}`,
        planExecutionId: `${tableData[data1.length]['planExecutionId']}`,
      });

    }
    return data1; 
  };

  let testData = generateTestData(50);  

  return ( 
  <>
    <div className={classes.container}>
      <Table
        options={{ paging : true }}
        data={testData}
        columns={columns}
        title="Execution History"
      />
    </div>
  </>
)};

export default MyComponent;

