import { Box, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';
import ElementManager from './ElementManager';
import AvatarManager from './AvatarManager';

const AdminDashboard = () => {
  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>Elements</Tab>
          <Tab>Avatars</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ElementManager />
          </TabPanel>
          <TabPanel>
            <AvatarManager />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;
