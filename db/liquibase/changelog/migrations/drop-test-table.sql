--liquibase formatted sql

--changeset ricky:drop-test-table
DROP TABLE test_table;

--rollback CREATE TABLE test_table (id UUID PRIMARY KEY, stuff TEXT NOT NULL);