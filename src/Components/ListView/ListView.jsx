import React, { Component } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Table, Spinner, Alert, InputGroup, InputGroupAddon, Input } from 'reactstrap';

const URL = 'http://localhost:5000/api/people/';

const getDate = (date) => {
  let momentDate = moment(date)
  return momentDate.format("DD.MM.YYYY");
}

export class ListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      persons: [],
      isLoading: false,
      error: null,
      search: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    axios.get(URL,{mode:"no-cors"})
      .then(response => {
        if (response.status === 200) { 
          console.log('ok');
          console.log(response);
          return response.data;
        } else {
          console.log('error');
          console.log(response);
          throw new Error('Whoops... Error occurred');
        }
      })
      .then(persons => this.setState({ persons, isLoading: false }))
      .catch(e => this.setState({ isLoading: false, error: e }));
  }

  handleChange = (event) => {
    this.setState({ search: event.target.value });
  }

  render() {
    const { persons, isLoading, error, search } = this.state;

    if (error) {
      return (
        <Alert color="danger">{error.message}</Alert>
      );
    }

    if (isLoading) {
      return <Spinner color="dark" />;
    }

    if (persons.length === 0) {
      return (
        <Alert color="info">Нет данных</Alert>
      );
    }

    return (
      <React.Fragment>
        <InputGroup className="input">
          <InputGroupAddon addonType="prepend">Поиск</InputGroupAddon>
          <Input placeholder="Фамилия или Имя" onChange={this.handleChange} />
        </InputGroup>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Дата рождения</th>
              <th>Пол</th>
              <th>Образование</th>
              <th>Состоит в браке</th>
            </tr>
          </thead>
          <tbody>
            {persons.filter(item => 
            (item.firstName + item.lastName).toLowerCase().includes(search) 
            ).map((person, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{person.firstName}</td>
                  <td>{person.lastName}</td>
                  <td>{getDate(person.birthday)}</td>
                  <td>{person.gender}</td>
                  <td>{person.education}</td>
                  <td>{person.isMarried === 'true' ? 'Да' : 'Нет'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </React.Fragment>
    )
  }
}

export default ListView
