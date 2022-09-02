import React from 'react';
import { Accordion,AccordionDetails, AccordionSummary, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExampleLogViewer from '../logs/ExampleLogViewer';
export const AccordionwithArray = (rows : any) => {
    return (
    <>
    <Grid item>
        {rows?.rows?.map((row: { id: string; name: string; stepId: string; baseFqn: string; runSequence: Number; pipelineIdentifier: string;})  =>
        <Accordion key={row.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                <Typography>{row.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ExampleLogViewer row={row} />
            </AccordionDetails>
        </Accordion>
        )}
    </Grid>
</>
);
};