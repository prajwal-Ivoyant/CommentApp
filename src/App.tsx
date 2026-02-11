import "./App.css";
import { Layout } from "antd";
import CommentsSection from "./components/commentSection";

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout >
      <Header>
        <h2>Commenter...</h2>
      </Header>

      <Content className="appContent">
        <CommentsSection />
      </Content>

      <Footer >All rights are reserved</Footer>
    </Layout>
  );
}

export default App;
