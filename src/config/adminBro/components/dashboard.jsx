import { Box, H1, Text } from '@adminjs/design-system';

const Dashboard = (props) => {
  return (
    <Box
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      <Box>
        <H1 textAlign="center">Welcome To Tombola Wot</H1>
        <Text textAlign="center">
          This is your admin interface you can manage your platform users as
          well as all of your resources.
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
