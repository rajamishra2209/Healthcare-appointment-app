import React from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const MedicalHistory = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle form
  const handleFinish = async(values) =>{
    try{
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/medical-history",
        { ...values, userId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Data saved successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    }catch(error){
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrongg')
    }
  }
  return (
    <Layout>
          <h1 className="text-center">Medical History</h1>
          <Form layout="vertical" onFinish={handleFinish} className="m-3">
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
              Submit
            </button>
          </Col>
          </Row>
        </Form>
    </Layout>
  )
}

export default MedicalHistory;