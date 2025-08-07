--liquibase formatted sql

--changeset ricky:create-task-system splitStatements:false

CREATE TABLE users (
    id TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by TEXT REFERENCES users NOT NULL,
    title TEXT NOT NULL
);

CREATE TABLE group_users (
    group_id UUID REFERENCES groups,
    user_id TEXT REFERENCES users
);

CREATE UNIQUE INDEX group_users_group_id_user_id_index
ON group_users (group_id, user_id);

CREATE INDEX group_users_user_id_group_id_index
ON group_users (user_id, group_id);

CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'done');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    created_by TEXT REFERENCES users NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    last_updated_by TEXT REFERENCES users NOT NULL,
    status task_status NOT NULL,
    title TEXT NOT NULL
);

CREATE FUNCTION set_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at := current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_last_updated_at_in_tasks
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_last_updated_at();


--rollback DROP TRIGGER trigger_set_last_updated_at_in_tasks ON tasks;
--rollback DROP FUNCTION set_last_updated_at;
--rollback DROP TABLE tasks;
--rollback DROP TYPE task_status;
--rollback DROP TABLE group_users;
--rollback DROP TABLE groups;
--rollback DROP TABLE users;