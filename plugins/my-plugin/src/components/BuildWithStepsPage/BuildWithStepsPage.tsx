import React, { useEffect, useState } from 'react';
import { Accordion,AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@material-ui/core';
import { Breadcrumbs, Link } from '@backstage/core-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEntity } from "@backstage/plugin-catalog-react";
import {AccordionwithArray} from './AccordionwithArray';

export const BuildWithStepsPage = () => {
    const [data1,setdata]=useState();
    const [count, setCount] = useState(0);
    const{ entity } = useEntity();
    const [final, setFinal] =  useState<{id: string, name: string, buildDetails: string, nodeId: string}[]>([]); 
    
    useEffect(() => {
        const projectid = 'projectIdentifier';
        const orgid = 'orgIdentifier';
        const accid = 'accountIdentifier';
        const query = new URLSearchParams({
        routingId: `${entity.metadata.annotations?.[accid]}`,
        accountIdentifier: `${entity.metadata.annotations?.[accid]}`,
        orgIdentifier: `${entity.metadata.annotations?.[orgid]}` ,
        projectIdentifier: `${entity.metadata.annotations?.[projectid]}`,
      }).toString();
      const url = window.location.pathname;
      const planExecutionId = url.split("/").pop();
      async function run()
      {
      const response = await fetch(`http://34.123.54.143:7007/api/proxy/harness/gateway/pipeline/api/pipelines/execution/v2/${planExecutionId}?${query}`);
      const data = await response.json();
      setdata(data.data.pipelineExecutionSummary.layoutNodeMap);
      };
      run();
      }, []);
      const json : any = data1 || {};
      let builds: { id: string, name: string, nodeId: string }[] = [];
      Object.keys(json).forEach(function(key) {
        builds.push({
          id: `${builds.length + 1}`,
          name: json[key].name,
          nodeId: key,
        });
      });



      let datanode : string = builds[count]?.nodeId;
      
      useEffect(() => {
        const projectid = 'projectIdentifier';
        const orgid = 'orgIdentifier';
        const accid = 'accountIdentifier';
        const querynode = new URLSearchParams({
        routingId: `${entity.metadata.annotations?.[accid]}`,
        accountIdentifier: `${entity.metadata.annotations?.[accid]}`,
        orgIdentifier: `${entity.metadata.annotations?.[orgid]}` ,
        projectIdentifier: `${entity.metadata.annotations?.[projectid]}`,
        stageNodeId: `${datanode}`,
      }).toString();
      const url = window.location.pathname;
      const planExecutionId = url.split("/").pop();
      async function runnode()
      {
      const response = await fetch(`http://34.123.54.143:7007/api/proxy/harness/gateway/pipeline/api/pipelines/execution/v2/${planExecutionId}?${querynode}`);
      const data = await response.json();
      let buildsteps: {id: string,  name: string, stepId: string, baseFqn: string, runSequence: Number, pipelineIdentifier: string}[] = [];
      const json2 = data.data.executionGraph.nodeMap || {};
      const json3 = data.data.pipelineExecutionSummary || {};
      Object.keys(json2).reverse().forEach(function(key) {
        buildsteps.push({
          id: `${buildsteps.length+1}`,
          name: json2[key].name,
          stepId: key,
          baseFqn: json2[key].baseFqn,
          runSequence: json3.runSequence,
          pipelineIdentifier: json3.pipelineIdentifier,
        });
      });

      const newObj = {
        ...builds[count],
        buildDetails: `${JSON.stringify(buildsteps)}`
      }
      
      if(newObj.id) {
        setFinal(prev => [...prev, newObj]);
      }
      };
    
      runnode();
      if (count < builds.length - 1) {
        setCount(count + 1);
      }
      }, [datanode]);



  return (
    <>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="..">All builds</Link>
          <Typography>Build details</Typography>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={3} direction="column">
        <Grid item>
        {final.map(build =>
        <Accordion key={build.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{build.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3} direction="column">
            <AccordionwithArray key={JSON.parse(build.buildDetails).id} rows={JSON.parse(build.buildDetails)} />
          </Grid>
        </AccordionDetails>
      </Accordion>
    )}
        </Grid>
      </Grid>
    </>
  );
};




