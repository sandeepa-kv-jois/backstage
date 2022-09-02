import { Content, InfoCard } from "@backstage/core-components";
import { Grid, Typography} from "@material-ui/core";
import React from "react";
import { useEntity } from "@backstage/plugin-catalog-react";

export const EntityOverviewCard = () => {
    const{ entity } = useEntity();
    const HARNESSCI_ANNOTATION = 'harnessci/project-slug';

    return (
    <Content>
        <Grid container spacing={3} direction="column">
            <Grid item>
                <InfoCard title="Information Card">
                    <Typography>
                        Hello from Harness CI!!
                        <br />
                        Your repo is {entity.metadata.annotations?.[HARNESSCI_ANNOTATION]}
                    </Typography>
                </InfoCard>
            </Grid>
        </Grid>
    </Content>
    );
};