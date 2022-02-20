import { Button, Input, List, Modal, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { API_DOMAIN } from '../constants/common';
import useApi from '../hooks/useApi';
import { Select } from 'antd';
import { Typography, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const { Option } = Select;

const ProductError = () => {
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')));
  const { data, loading: loading1 } = useApi(`${API_DOMAIN}/products`);
  const { data: colors, loading: loading2 } = useApi(`${API_DOMAIN}/colors`);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleChangeInput = (e, id, name) => {
    const newValue = e.target.value;
    const product = products.find((p) => p.id === id);
    const newProduct = { ...product, [name]: newValue, [name + 'Error']: false };
    const newProducts = products.map((p) => (p.id === id ? newProduct : p));
    setProducts(newProducts);
    // console.log(newProducts);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  // console.log(products);

  const handleSubmit = () => {
    const newProductArray = [...products];
    let hasError = false;
    newProductArray.forEach((product) => {
      if (product.name === '' || product.name.length > 50) {
        product.nameError = true;
        hasError = true;
      }
      if (product.sku === '' || product.sku.length > 20) {
        product.skuError = true;
        hasError = true;
      }
    });
    if (hasError) {
      setProducts(newProductArray);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleChangeColor = (value, id) => {
    const product = products.find((p) => p.id === id);
    const newProduct = { ...product, color: Number(value) };
    // console.log(newProduct);
    const newProducts = products.map((p) => (p.id === id ? newProduct : p));
    setProducts(newProducts);
  };

  const findColor = (id, colors) => {
    const color = colors?.find((c) => c.id === id);
    return color ? color.name : '';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Error Description',
      dataIndex: 'errorDescription',
      key: 'errorDescription',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => {
        return (
          <div>
            <img src={record?.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <div>
            <Input value={record?.name} onChange={(e) => handleChangeInput(e, record?.id, 'name')} />
            <div>{record?.nameError && <Text type="danger">Invalid name</Text>}</div>
          </div>
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (text, record) => {
        return (
          <div>
            <Input value={record?.sku} onChange={(e) => handleChangeInput(e, record?.id, 'sku')} />
            <div>{record?.skuError && <Text type="danger">Invalid SKU</Text>}</div>
          </div>
        );
      },
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (text, record) => {
        const defaultColor = record?.color ? findColor(record?.color, colors) : 'select color';
        return (
          <Select onChange={(value) => handleChangeColor(value, record?.id)} defaultValue={defaultColor}>
            {colors?.map((color) => {
              return <Option key={color?.id}>{color.name}</Option>;
            })}
          </Select>
        );
      },
    },
  ];

  useEffect(() => {
    if (!products) {
      setProducts(data);
    }
  }, [data]);

  useEffect(() => {
    if (products) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  if (loading1 || loading2) {
    return (
      <div className="page">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="container">
      <Modal
        title="Re-uploaded Products"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <List
          style={{ height: '300px', overflow: 'auto' }}
          itemLayout="horizontal"
          dataSource={products}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: 'stretch' }}>
              <img src={item?.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div style={{ marginLeft: '10px' }}>
                <Space direction="vertical">
                  <Text className="text" style={{ fontWeight: 'bold' }}>
                    {item?.name}
                  </Text>
                  <Text>ID: {item?.id}</Text>
                  <Text className="text">
                    SKU: <span style={{ color: 'red' }}>{item?.sku}</span>
                  </Text>
                  <Text className="text">Color: {findColor(item?.color, colors)}</Text>
                </Space>
              </div>
            </List.Item>
          )}
        />
      </Modal>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Jason - Re-upload Error Products</h3>
        <Button icon={<UploadOutlined />} onClick={handleSubmit} type="primary" style={{ marginBottom: '10px' }} danger>
          Submit
        </Button>
      </div>
      <Table rowKey="id" pagination={{ pageSize: 10 }} dataSource={products} columns={columns} bordered />;
    </div>
  );
};

export default ProductError;
