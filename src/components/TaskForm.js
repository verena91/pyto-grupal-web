import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;


function TaskForm (props) {

    // const [task, setTask] = useState({});
    const [types, setTypes] = useState([]);
    const [form] = Form.useForm();

    // Ejecutado solo al renderizar el componente por primera vez
    useEffect(() => {

        // Obtengo los tipos del backend para poder mostrar en el select
        axios.get('/ws/rest/types')
            .then(res => {
                setTypes(res.data)
            })
            .catch(err => {
                console.log(err);
            });

        const { match } = props;
        if (match.params.taskId) {
            axios.get(`/ws/rest/tasks/${match.params.taskId}`)
                .then((rsp) => {
                    // NOTE: modificamos atributo type para tener como id
                    let taskForm = rsp.data;
                    taskForm.type = taskForm.type ? taskForm.type.id : null;
                    taskForm.limitDate = taskForm.limitDate ? moment(taskForm.limitDate) : moment();
                    form.setFieldsValue(taskForm);
            });
        }
    }, []);

    const submit = (formTask) => {
        // NOTE: modificamos atributo type para enviar como objeto
        formTask.type = {
            id: formTask.type
        }
        const { match, history } = props;
        if (match.params.taskId) {
            axios.put(`/ws/rest/tasks/${match.params.taskId}`, formTask)
                .then((rsp) => {
                    alert('exito');
                    history.push('/tasks');
                });
        } else {
            axios.post(`/ws/rest/tasks/`, formTask)
                .then((rsp) => {
                    alert('exito');
                    history.push('/tasks');
                });
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
            initialValues={{ remember: true }}
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
                rules={[{ required: true, message: 'Required!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: 'Required!' }]}
            >
                <Select style={{ width: '100%' }} onChange={(value) => console.log('handleChangeSelect -> ' + value)}>
                    {
                        types.map(type => {
                            return (
                                <Option key={type.id} value={type.id}>{type.name}</Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="Limit Date"
                name="limitDate"
                rules={[{ required: true, message: 'Required!' }]}
            >
                <DatePicker onChange={(date) => console.log('handleChangeDatepicker -> ' + date)} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Row>
                    <Col span={12}>
                        <Button type="default" onClick={() => props.history.push(`/tasks`)}>
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

export default TaskForm;