import React, { useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Row, Col, Button } from 'antd';

function TypeForm(props) {

    const [form] = Form.useForm();

    useEffect(() => {
        if (props.match.params.typeId) {
            axios.get('/ws/rest/types/'+props.match.params.typeId)
                .then((res) => {
                    console.log(res.data);
                    form.setFieldsValue(res.data);
                });
        }
    },[]);

    const submit = (typeForm) => {
        // edicion
        if (props.match.params.typeId) {
            axios.put('/ws/rest/types/'+props.match.params.typeId, typeForm)
                .then((res) => {
                    console.log(res);
                    props.history.push('/types');
                })
                .catch((err) => {
                    console.log(err);
                    // alert(err);
                })
        } 
        // creacion
        else {
            axios.post('/ws/rest/types', typeForm)
                .then((res) => {
                    console.log(res);
                    props.history.push('/types');
                })
                .catch((err) => {
                    console.log(err);
                    // alert(err);
                })
        }
    }

    const onFinish = values => {
        console.log('Success:', values);
        submit(values);
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            style={{width: '60%', margin: '0 auto'}}
            form={form}
            layout="vertical"
            name="basic"
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Required!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
            >
                <Input/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Row>
                    <Col span={12}>
                        <Button type="default" onClick={() => props.history.push(`/types`)}>
                            Cancel
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
}

export default TypeForm;