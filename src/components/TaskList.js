import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Space, Tooltip, Button } from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

function TaskList (props) {

    const [tasks, setTasks] = useState([]);

    const getTasks = () => {
        // axios.get('ws/rest/tasks/paginated', { params: { pageSize: 2, first: 0 }})
        axios.get('ws/rest/tasks')
            .then(res => {
                setTasks(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getTasks();
    }, [])

    const deleteTask = id => {
        axios.delete(`/ws/rest/tasks/${id}`)
            .then(res => {
                alert(`Tarea con ID: ${id} borrada correctamente`);
                getTasks();
            })
            .catch(err => {
                console.log(err);
            });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
            title: 'Limit Date',
            dataIndex: 'limitDate',
            key: 'limitDate',
            render: date => moment(date).format('YYYY-MM-DD')
          },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
          render: type => (
            <>
              {type && type.name}
            </>
          ),
        },
        {
          title: 'Actions',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
                <Tooltip title="Edit">
                    <Button 
                        type="primary" 
                        shape="circle" 
                        onClick={() => props.history.push(`${props.match.url}/edit/${record.id}`)} 
                        icon={<EditFilled />} />
                </Tooltip>
                <Tooltip title="Delete">
                    <Button 
                        type="danger" 
                        shape="circle" 
                        onClick={() => deleteTask(record.id)} 
                        icon={<DeleteFilled />} />
                </Tooltip>
            </Space>
          ),
        }
    ];

    return (
        <div>
            <Row style={{ padding: 20 }}>
                <Col span={22}></Col>
                <Col span={2}>
                <Tooltip title="New">
                    <Button 
                        type="primary" 
                        shape="round" 
                        onClick={() => props.history.push(`${props.match.url}/new`)}
                        icon={<PlusOutlined />}>New Task</Button>
                </Tooltip>
                </Col>
            </Row>
            <Table pagination={{ defaultCurrent:1, pageSize: 3, total:tasks.length }} columns={columns} dataSource={tasks} />
        </div>
    )
}

export default TaskList;