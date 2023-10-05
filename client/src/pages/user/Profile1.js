import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row,  message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";


const Profile1 = () => {
  const { user } = useSelector((state) => state.user);
  const [medical, setMedical] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // update medical info ==========
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/updateMedicalProfile",
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong ");
    }
  };
  // update user medical info ==========


  //getMedical Details
  const getMedicalInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/getMedicalInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setMedical(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMedicalInfo();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h1>Manage Medical History</h1>
      {medical && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...medical,
          }}
        >
          <h4 className="">Patient Medical Details : </h4>
          <Row gutter={5}>
            <Form.Item
            label="Allergies"
            name="allergies"
            required
            rules={[{ required: true }]}
            >
            <Input type="text" placeholder="what are you allergic to" style={{width: "400px"}}/>
            </Form.Item>
        </Row>
        <Row gutter={5}>
            <Form.Item
            label="Medications"
            name="medications"
            required
            rules={[{ required: true }]}
            >
            <Input type="text" placeholder="past medicine that a doctor has given to you" style={{width: "400px"}} />
            </Form.Item>
        </Row>
        <Row gutter={5}>
            <Form.Item
            label="Past Procedure"
            name="pastProcedure"
            required
            rules={[{ required: true }]}
            >
            <Input type="text" placeholder="what is a past medical history procedure" style={{width: "400px"}} />
            </Form.Item>
        </Row>
        <Row gutter={5}>
        <Col xs={24} md={24} lg={8}>
            <button className="btn btn-primary form-btn " type="submit" >
              Update
            </button>
          </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile1;